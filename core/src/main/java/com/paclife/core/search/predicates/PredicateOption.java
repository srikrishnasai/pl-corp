package com.paclife.core.search.predicates;

import javax.annotation.Nonnull;
import java.util.Comparator;
import java.io.Serializable;

public class PredicateOption {

    private final String label;
    private final String value;
    private boolean active;

    public PredicateOption(@Nonnull String label, @Nonnull String value) {
        this.label = label;
        this.value = value;
        this.active = false;
    }

    public String getLabel() {
        return label;
    }

    public String getValue() {
        return value;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public boolean isActive() { return active; }

    public static final class AlphabeticalByLabel implements Comparator<PredicateOption>, Serializable {
        private static final long serialVersionUID = 1;
        
        @Override
        public int compare(PredicateOption o1, PredicateOption o2) {
            return o1.getLabel().compareToIgnoreCase(o2.getLabel());
        }
    }
}
